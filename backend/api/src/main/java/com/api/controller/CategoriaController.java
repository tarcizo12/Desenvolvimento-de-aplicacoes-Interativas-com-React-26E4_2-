package com.api.controller;

import com.categoria.domain.dto.CategoriaRequest;
import com.categoria.domain.dto.CategoriaResponse;
import com.categoria.domain.entity.CategoriaEntity;
import com.categoria.repository.CategoriaRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Comparator;

@RestController
@RequestMapping("/com/api/categorias")
public class CategoriaController {

    private final CategoriaRepository repository;

    public CategoriaController(CategoriaRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<CategoriaResponse>> listarTodos() {
        List<CategoriaResponse> categorias = repository.findAll().stream()
                .map(this::toResponse)
                .sorted(Comparator.comparing(CategoriaResponse::nome, String.CASE_INSENSITIVE_ORDER))
                .toList();
        return ResponseEntity.ok(categorias);
    }

    @PostMapping
    public ResponseEntity<CategoriaResponse> incluir(
            @Valid @RequestBody CategoriaRequest request) {
        if (repository.existsByNomeIgnoreCase(request.getNome().trim())) {
            throw new IllegalArgumentException("Já existe uma categoria com esse nome.");
        }
        CategoriaEntity categoria = new CategoriaEntity(
                request.getNome().trim(),
                request.getDescricao()
        );
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(toResponse(repository.save(categoria)));
    }

    private CategoriaResponse toResponse(CategoriaEntity categoria) {
        return new CategoriaResponse(
                categoria.getId(),
                categoria.getNome(),
                categoria.getDescricao()
        );
    }
}
