package com.api.controller;

import com.fornecedor.domain.dto.FornecedorResponse;
import com.fornecedor.domain.dto.FornecedorCreateRequest;
import com.fornecedor.service.FornecedorService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/com/api/fornecedores")
@RequiredArgsConstructor
public class FornecedorController {

    private final FornecedorService fornecedorService;

    @PostMapping
    public ResponseEntity<FornecedorResponse> incluir(
            @Valid @RequestBody FornecedorCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(fornecedorService.incluir(request));
    }

    @Operation(summary = "Importa fornecedores de forma síncrona a partir de um CSV")
    @PutMapping(
            value = "/importacao",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<String> importar(
            @RequestPart("arquivo") MultipartFile arquivo) {
        return ResponseEntity.ok(fornecedorService.importarCsv(arquivo));
    }

    @GetMapping
    public ResponseEntity<List<FornecedorResponse>> listarTodos() {
        return ResponseEntity.ok(fornecedorService.listarTodos());
    }
}