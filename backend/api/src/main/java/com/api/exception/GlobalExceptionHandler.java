package com.api.exception;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RegistroNaoLocalizadoException.class)
    public ResponseEntity<ErroResponse> handleNotFound(
            RegistroNaoLocalizadoException ex,
            HttpServletRequest request) {
        return erro(ex, HttpStatus.NOT_FOUND, request);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErroResponse> handleEntityNotFound(
            EntityNotFoundException ex,
            HttpServletRequest request) {
        return erro(ex, HttpStatus.NOT_FOUND, request);
    }

    @ExceptionHandler({EntradaInvalidaException.class, EstoqueInsuficienteException.class})
    public ResponseEntity<ErroResponse> handleBadRequest(
            RuntimeException ex,
            HttpServletRequest request) {
        return erro(ex, HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErroResponse> handleIllegalArgument(
            IllegalArgumentException ex,
            HttpServletRequest request) {
        return erro(ex, HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErroResponse> handleConflict(
            DataIntegrityViolationException ex,
            HttpServletRequest request) {
        return erro(
                new IllegalArgumentException("Os dados informados conflitam com um registro existente."),
                HttpStatus.CONFLICT,
                request
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResponse> handleValidationExceptions(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {
        String mensagem = ex.getBindingResult().getAllErrors().stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.joining("; "));
        return erro(
                new IllegalArgumentException("Erro de validação: " + mensagem),
                HttpStatus.BAD_REQUEST,
                request
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroResponse> handleGeneric(
            Exception ex,
            HttpServletRequest request) {
        String mensagem = "Erro interno no servidor: " + ex.getMessage();
        return erro(mensagem, HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    private ResponseEntity<ErroResponse> erro(
            Exception exception,
            HttpStatus status,
            HttpServletRequest request) {
        return erro(exception.getMessage(), status, request);
    }

    private ResponseEntity<ErroResponse> erro(
            String mensagem,
            HttpStatus status,
            HttpServletRequest request) {
        ErroResponse response = new ErroResponse(
                mensagem,
                status.value(),
                request.getRequestURI()
        );
        return ResponseEntity.status(status).body(response);
    }
}
