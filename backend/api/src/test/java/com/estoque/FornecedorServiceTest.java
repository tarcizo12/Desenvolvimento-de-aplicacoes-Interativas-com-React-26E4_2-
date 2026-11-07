package com.estoque;

import com.fornecedor.domain.entity.FornecedorEntity;
import com.fornecedor.repository.FornecedorRepository;
import com.fornecedor.service.FornecedorService;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class FornecedorServiceTest {

    @Test
    void importaCsvSincronamentePreservandoVirgulasNoEnderecoEIgnorandoDuplicados() {
        FornecedorRepository repository = mock(FornecedorRepository.class);
        when(repository.existsByCnpj(anyString())).thenReturn(false);
        when(repository.saveAll(anyIterable())).thenAnswer(invocation -> {
            Iterable<FornecedorEntity> fornecedores = invocation.getArgument(0);
            List<FornecedorEntity> salvos = new ArrayList<>();
            fornecedores.forEach(salvos::add);
            return salvos;
        });

        String conteudo = """
                nome,cnpj,telefone,email,endereco
                Distribuidora Exemplo,11.111.111/0001-11,(11) 99999-1111,exemplo@example.com,Avenida Central, 452 - Centro
                Fornecedor repetido,11.111.111/0001-11,,,Rua duplicada, 12
                """;
        MockMultipartFile arquivo = new MockMultipartFile(
                "arquivo",
                "fornecedores.csv",
                "text/csv",
                conteudo.getBytes(StandardCharsets.UTF_8)
        );

        String resultado = new FornecedorService(repository).importarCsv(arquivo);

        assertEquals(
                "Importação concluída: 1 fornecedor(es) inserido(s), 1 duplicado(s) ignorado(s).",
                resultado
        );
        verify(repository).saveAll(argThat(fornecedores -> {
            List<FornecedorEntity> itens = new ArrayList<>();
            fornecedores.forEach(itens::add);
            return itens.size() == 1
                    && itens.get(0).getEndereco().equals("Avenida Central,452 - Centro");
        }));
    }
}
