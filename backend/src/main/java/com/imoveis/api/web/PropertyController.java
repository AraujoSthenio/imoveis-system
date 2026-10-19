package com.imoveis.api.web;

import com.imoveis.api.domain.Property;
import com.imoveis.api.service.PropertyService;
import com.imoveis.api.web.dto.PropertyRequest;
import com.imoveis.api.web.dto.PropertyResponse;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;

    @GetMapping
    public Page<PropertyResponse> search(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Property.TransactionType transactionType,
            @RequestParam(required = false) Property.PropertyType propertyType,
            @PageableDefault(size = 12, sort = "createdAt") Pageable pageable) {
        return propertyService.search(city, transactionType, propertyType, pageable);
    }

    @GetMapping("/{id}")
    public PropertyResponse findById(@PathVariable UUID id) {
        return propertyService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PropertyResponse create(@Valid @RequestBody PropertyRequest request) {
        return propertyService.create(request);
    }

    @PutMapping("/{id}")
    public PropertyResponse update(@PathVariable UUID id, @Valid @RequestBody PropertyRequest request) {
        return propertyService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        propertyService.delete(id);
    }
}
