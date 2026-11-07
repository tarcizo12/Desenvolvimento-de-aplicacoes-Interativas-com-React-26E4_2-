package com.fornecedor.domain.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record FornecedorCreateRequest(
        @NotBlank(message = "Nome do fornecedor é obrigatório")
        @Size(max = 150, message = "Nome deve ter no máximo 150 caracteres")
        String nome,
        @NotBlank(message = "CNPJ do fornecedor é obrigatório")
        @Size(max = 18, message = "CNPJ deve ter no máximo 18 caracteres")
        String cnpj,
        @Size(max = 20, message = "Telefone deve ter no máximo 20 caracteres")
        String telefone,
        @Email(message = "E-mail inválido")
        @Size(max = 150, message = "E-mail deve ter no máximo 150 caracteres")
        String email,
        @Size(max = 255, message = "Endereço deve ter no máximo 255 caracteres")
        String endereco
) {
}
