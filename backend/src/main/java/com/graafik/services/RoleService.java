package com.graafik.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.graafik.model.Entities.Role;
import com.graafik.repositories.RoleRepository;

@Service
public class RoleService {
    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    public Optional<Role> getRoleById(UUID id) {
        return roleRepository.findById(id);
    }

    public Role saveRole(Role role) {
        return roleRepository.save(role);
    }

    public Optional<Role> updateRole(UUID id, Role updated) {
        return roleRepository.findById(id).map(existing -> {
            existing.setName(updated.getName());
            existing.setColor(updated.getColor());
            existing.setBackgroundColor(updated.getBackgroundColor());
            return roleRepository.save(existing);
        });
    }

    public boolean deleteRole(UUID id) {
        if (roleRepository.existsById(id)) {
            roleRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
