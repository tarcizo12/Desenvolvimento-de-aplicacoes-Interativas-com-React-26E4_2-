package com.api.swagger;

import com.produto.domain.dto.ProdutoRequest;
import com.produto.domain.dto.ProdutoResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Produtos", description = "CRUD de produtos do estoque")
public interface ProdutoControllerDocs {

    @Operation(summary = "Listar todos os produtos (ordenados por nome)")
    @ApiResponse(responseCode = "200", description = "Lista de produtos")
    @GetMapping
    ResponseEntity<List<ProdutoResponse>> listarTodos();

    @Operation(summary = "Buscar produto por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Produto encontrado"),
            @ApiResponse(responseCode = "404", description = "Produto não encontrado")
    })
    @GetMapping("/{id}")
    ResponseEntity<ProdutoResponse> obterPorId(
            @Parameter(description = "ID do produto", example = "1")
            @PathVariable Long id);

    @Operation(summary = "Cadastrar novo produto")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Produto criado"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    @PostMapping
    ResponseEntity<ProdutoResponse> incluir(
            @Valid @RequestBody ProdutoRequest request);

    @Operation(summary = "Atualizar produto")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Produto atualizado"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "404", description = "Produto não encontrado")
    })
    @PutMapping("/{id}")
    ResponseEntity<ProdutoResponse> alterar(
            @Parameter(description = "ID do produto", example = "1")
            @PathVariable Long id,
            @Valid @RequestBody ProdutoRequest request);

    @Operation(summary = "Excluir produto")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Produto excluído"),
            @ApiResponse(responseCode = "404", description = "Produto não encontrado")
    })
    @DeleteMapping("/{id}")
    ResponseEntity<Void> excluir(
            @Parameter(description = "ID do produto", example = "1")
            @PathVariable Long id);
}