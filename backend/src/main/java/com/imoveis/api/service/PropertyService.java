package com.imoveis.api.service;

import com.imoveis.api.domain.Property;
import com.imoveis.api.domain.User;
import com.imoveis.api.repository.PropertyRepository;
import com.imoveis.api.repository.UserRepository;
import com.imoveis.api.web.dto.PropertyRequest;
import com.imoveis.api.web.dto.PropertyResponse;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<PropertyResponse> search(String city,
                                         Property.TransactionType transactionType,
                                         Property.PropertyType propertyType,
                                         Pageable pageable) {
        return propertyRepository.search(city, transactionType, propertyType, pageable)
                .map(PropertyResponse::from);
    }

    @Transactional(readOnly = true)
    public PropertyResponse findById(UUID id) {
        return propertyRepository.findById(id)
                .map(PropertyResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Imóvel não encontrado"));
    }

    @Transactional
    public PropertyResponse create(PropertyRequest request) {
        Property property = mapToEntity(request, new Property());
        property.setActive(true);
        // updated_by pode ser preenchido depois quando houver autenticação
        return PropertyResponse.from(propertyRepository.save(property));
    }

    @Transactional
    public PropertyResponse update(UUID id, PropertyRequest request) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Imóvel não encontrado"));
        mapToEntity(request, property);
        return PropertyResponse.from(propertyRepository.save(property));
    }

    @Transactional
    public void delete(UUID id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Imóvel não encontrado"));
        property.setActive(false);
        propertyRepository.save(property);
    }

    private Property mapToEntity(PropertyRequest req, Property p) {
        p.setTitle(req.title());
        p.setDescription(req.description());
        p.setPrice(req.price());
        p.setTransactionType(req.transactionType());
        p.setPropertyType(req.propertyType());
        p.setAreaM2(req.areaM2());
        p.setBedrooms(req.bedrooms());
        p.setBathrooms(req.bathrooms());
        p.setParkingSpaces(req.parkingSpaces());
        p.setStreet(req.street());
        p.setNumber(req.number());
        p.setNeighborhood(req.neighborhood());
        p.setCity(req.city());
        p.setState(req.state());
        p.setZipCode(req.zipCode());

        if (req.ownerId() != null) {
            User owner = userRepository.findById(req.ownerId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Owner não encontrado"));
            p.setOwner(owner);
        }
        return p;
    }
}
