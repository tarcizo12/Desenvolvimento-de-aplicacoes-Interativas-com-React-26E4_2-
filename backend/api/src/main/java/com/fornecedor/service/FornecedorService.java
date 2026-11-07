
package com.fornecedor.service;

import com.fornecedor.domain.dto.FornecedorResponse;
import com.fornecedor.domain.dto.FornecedorCreateRequest;
import com.fornecedor.domain.entity.FornecedorEntity;
import com.fornecedor.repository.FornecedorRepository;
import jakarta.persistence.EntityNotFoundException;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class FornecedorService {

    private final FornecedorRepository repository;

    @Autowired
    public FornecedorService(FornecedorRepository fornecedorRepository) {
        this.repository = fornecedorRepository;
    }

    public List<FornecedorResponse> listarTodos() {
        return repository.findAll()
                .stream()
                .map(this::toResponse)
                .sorted(Comparator.comparing(
                        FornecedorResponse::nome,
                        String.CASE_INSENSITIVE_ORDER
                ))
                .toList();
    }

    public FornecedorEntity getFornecedorById(Long id) {
        return this.repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Fornecedor não encontrado para o id " + id));
    }

    public FornecedorResponse incluir(FornecedorCreateRequest request) {
        String cnpj = request.cnpj().trim();
        if (repository.existsByCnpj(cnpj)) {
            throw new IllegalArgumentException("Já existe um fornecedor com esse CNPJ.");
        }

        FornecedorEntity fornecedor = new FornecedorEntity(
                request.nome().trim(),
                cnpj,
                normalizarOpcional(request.telefone()),
                normalizarOpcional(request.email()),
                normalizarOpcional(request.endereco())
        );
        return toResponse(repository.save(fornecedor));
    }

    private String normalizarOpcional(String valor) {
        return valor == null || valor.isBlank() ? null : valor.trim();
    }

    private FornecedorResponse toResponse(FornecedorEntity fornecedor) {
        return new FornecedorResponse(
                fornecedor.getId(),
                fornecedor.getNome(),
                fornecedor.getCnpj(),
                fornecedor.getTelefone(),
                fornecedor.getEmail(),
                fornecedor.getEndereco()
        );
    }


    @Transactional
    public String importarCsv(MultipartFile arquivo) {
        if (arquivo == null || arquivo.isEmpty()) {
            throw new IllegalArgumentException("O arquivo CSV não pode estar vazio.");
        }

        String nomeOriginal = arquivo.getOriginalFilename();

        if (nomeOriginal == null || !nomeOriginal.toLowerCase().endsWith(".csv")) {
            throw new IllegalArgumentException("O arquivo deve possuir extensão .csv.");
        }

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(
                arquivo.getInputStream(),
                StandardCharsets.UTF_8
        ))) {
            reader.mark(1);
            if (reader.read() != '\uFEFF') {
                reader.reset();
            }

            try (CSVParser parser = CSVFormat.DEFAULT.builder()
                .setHeader()
                .setSkipHeaderRecord(true)
                .setTrim(true)
                .build()
                .parse(reader)) {

                Set<String> cabecalhos = parser.getHeaderMap().keySet();
                if (!cabecalhos.containsAll(List.of("nome", "cnpj", "telefone", "email", "endereco"))) {
                    throw new IllegalArgumentException(
                            "O CSV deve conter as colunas: nome, cnpj, telefone, email e endereco."
                    );
                }

                Set<String> cnpjsLidos = new HashSet<>();
                List<FornecedorEntity> novosFornecedores = new ArrayList<>();
                int ignorados = 0;

                for (CSVRecord registro : parser) {
                    String nome = registro.get("nome").trim();
                    String cnpj = registro.get("cnpj").trim();
                    if (nome.isBlank() || cnpj.isBlank()) {
                        throw new IllegalArgumentException(
                                "Nome e CNPJ são obrigatórios em todas as linhas do CSV."
                        );
                    }

                    if (repository.existsByCnpj(cnpj) || !cnpjsLidos.add(cnpj)) {
                        ignorados++;
                        continue;
                    }

                    List<String> campos = registro.toList();
                    String endereco = String.join(
                            ",",
                            campos.subList(parser.getHeaderMap().get("endereco"), campos.size())
                    ).trim();
                    novosFornecedores.add(new FornecedorEntity(
                            nome,
                            cnpj,
                            normalizarOpcional(registro.get("telefone")),
                            normalizarOpcional(registro.get("email")),
                            normalizarOpcional(endereco)
                    ));
                }

                repository.saveAll(novosFornecedores);
                return "Importação concluída: %d fornecedor(es) inserido(s), %d duplicado(s) ignorado(s)."
                        .formatted(novosFornecedores.size(), ignorados);
            }
        } catch (IOException e) {
            throw new IllegalStateException(
                    "Não foi possível ler o arquivo CSV.",
                    e
            );
        }
    }

}
