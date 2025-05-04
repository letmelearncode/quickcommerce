package com.quickcommerce.backend.repository;

import com.quickcommerce.backend.model.Address;
import com.quickcommerce.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    
    List<Address> findByUserOrderByIsDefaultDesc(User user);
    
    Optional<Address> findByIdAndUser(Long id, User user);
    
    @Query("UPDATE Address a SET a.isDefault = false WHERE a.user = :user AND a.id != :addressId")
    @Modifying
    void unsetOtherDefaultAddresses(User user, Long addressId);
    
    boolean existsByIdAndUser(Long id, User user);
    
    void deleteByIdAndUser(Long id, User user);
} 