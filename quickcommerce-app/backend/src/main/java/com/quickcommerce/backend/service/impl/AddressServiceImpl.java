package com.quickcommerce.backend.service.impl;

import com.quickcommerce.backend.dto.AddressDTO;
import com.quickcommerce.backend.exception.ResourceNotFoundException;
import com.quickcommerce.backend.model.Address;
import com.quickcommerce.backend.model.User;
import com.quickcommerce.backend.repository.AddressRepository;
import com.quickcommerce.backend.service.AddressService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;

    @Override
    @Transactional
    public AddressDTO saveAddress(User user, AddressDTO addressDTO) {
        Address address = mapToEntity(addressDTO);
        address.setUser(user);
        
        // If this is the first address or marked as default
        if (addressRepository.findByUserOrderByIsDefaultDesc(user).isEmpty() || Boolean.TRUE.equals(addressDTO.getIsDefault())) {
            address.setIsDefault(true);
            // Unset other default addresses if this is marked as default
            if (Boolean.TRUE.equals(addressDTO.getIsDefault())) {
                addressRepository.unsetOtherDefaultAddresses(user, null);
            }
        }
        
        Address savedAddress = addressRepository.save(address);
        return mapToDTO(savedAddress);
    }

    @Override
    public List<AddressDTO> getAllAddresses(User user) {
        return addressRepository.findByUserOrderByIsDefaultDesc(user)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AddressDTO updateAddress(User user, Long addressId, AddressDTO addressDTO) {
        Address address = addressRepository.findByIdAndUser(addressId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found", String.valueOf(addressId), null));
        
        updateAddressFields(address, addressDTO);
        
        // Handle default address changes
        if (Boolean.TRUE.equals(addressDTO.getIsDefault()) && !Boolean.TRUE.equals(address.getIsDefault())) {
            addressRepository.unsetOtherDefaultAddresses(user, addressId);
            address.setIsDefault(true);
        }
        
        Address updatedAddress = addressRepository.save(address);
        return mapToDTO(updatedAddress);
    }

    @Override
    @Transactional
    public void deleteAddress(User user, Long addressId) {
        if (!addressRepository.existsByIdAndUser(addressId, user)) {
            throw new ResourceNotFoundException("Address not found", String.valueOf(addressId), null);
        }
        addressRepository.deleteByIdAndUser(addressId, user);
    }

    @Override
    @Transactional
    public AddressDTO setDefaultAddress(User user, Long addressId) {
        Address address = addressRepository.findByIdAndUser(addressId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found", String.valueOf(addressId), null));
        
        addressRepository.unsetOtherDefaultAddresses(user, addressId);
        address.setIsDefault(true);
        
        Address updatedAddress = addressRepository.save(address);
        return mapToDTO(updatedAddress);
    }

    private Address mapToEntity(AddressDTO dto) {
        Address address = new Address();
        updateAddressFields(address, dto);
        return address;
    }

    private void updateAddressFields(Address address, AddressDTO dto) {
        address.setFullName(dto.getFullName());
        address.setStreet(dto.getStreet());
        address.setCity(dto.getCity());
        address.setState(dto.getState());
        address.setZipCode(dto.getZipCode());
        address.setCountry(dto.getCountry());
        address.setPhone(dto.getPhone());
        address.setApartment(dto.getApartment());
        address.setAdditionalInfo(dto.getAdditionalInfo());
        address.setIsDefault(dto.getIsDefault());
    }

    private AddressDTO mapToDTO(Address address) {
        return AddressDTO.builder()
                .id(address.getId())
                .fullName(address.getFullName())
                .street(address.getStreet())
                .city(address.getCity())
                .state(address.getState())
                .zipCode(address.getZipCode())
                .country(address.getCountry())
                .phone(address.getPhone())
                .apartment(address.getApartment())
                .additionalInfo(address.getAdditionalInfo())
                .isDefault(address.getIsDefault())
                .build();
    }
} 