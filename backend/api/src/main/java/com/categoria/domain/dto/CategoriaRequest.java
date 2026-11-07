package com.categoria.domain.dto;

import com.categoria.domain.entity.CategoriaEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Dados de uma categoria")
public class CategoriaRequest {

    @Schema(description = "ID da categoria", example = "1")
    private Long id;

    @Schema(description = "Nome da categoria", example = "Eletrônicos", required = true)
    @NotBlank(message = "Nome da categoria é obrigatório")
    @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
    private String nome;

    @Schema(description = "Descrição da categoria", example = "Equipamentos eletrônicos")
    @Size(max = 255, message = "Descrição deve ter no máximo 255 caracteres")
    private String descricao;

    public CategoriaRequest() {}

    public CategoriaRequest(CategoriaEntity categoria) {
        this.id = categoria.getId();
        this.nome = categoria.getNome();
        this.descricao = categoria.getDescricao();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}