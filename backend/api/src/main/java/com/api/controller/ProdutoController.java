package com.api.controller;

import com.api.swagger.ProdutoControllerDocs;
import com.produto.domain.dto.ProdutoRequest;
import com.produto.domain.dto.ProdutoResponse;
import com.produto.service.ProdutoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/com/api/produtos")
public class ProdutoController implements ProdutoControllerDocs {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    @Override
    public ResponseEntity<List<ProdutoResponse>> listarTodos() {
        return ResponseEntity.ok(produtoService.listarTodosOrdenadosPorNome());
    }

    @Override
    public ResponseEntity<ProdutoResponse> obterPorId(Long id) {
        return ResponseEntity.ok(produtoService.obterPorId(id));
    }

    @Override
    public ResponseEntity<ProdutoResponse> incluir(ProdutoRequest request) {
        ProdutoResponse novo = produtoService.incluir(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(novo);
    }

    @Override
    public ResponseEntity<ProdutoResponse> alterar(Long id, ProdutoRequest request) {
        return ResponseEntity.ok(produtoService.alterar(id, request));
    }

    @Override
    public ResponseEntity<Void> excluir(Long id) {
        produtoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}