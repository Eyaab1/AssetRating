package com.example.demo.asset.service;
import com.example.demo.asset.model.Asset;
import com.example.demo.asset.repository.AssetRepository;
import com.example.demo.auth.*;

import jakarta.transaction.Transactional;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
@Service
public class AssetService {
    private final AssetRepository assetRepository;
    private final AuthRepository userRepository;

    public AssetService(AssetRepository assetRepository, AuthRepository userRepository) {
        this.assetRepository = assetRepository;
        this.userRepository = userRepository;
    }

    public List<Asset> getAllAssets() {
        return assetRepository.findAll();
    }

    public Optional<Asset> getAssetById(Long id) {
        return assetRepository.findById(id);
    }

    public Asset createAsset(Asset asset) {
        User currentUser = getAuthenticatedUser();
        asset.setPublisher(currentUser);
        return assetRepository.save(asset);
    }

    public void deleteAsset(Long id) {
        assetRepository.deleteById(id);
    }

    private User getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof UserDetails userDetails) {
            return userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }

        throw new RuntimeException("User not authenticated");
    }
    @Transactional
    public Asset updateAsset(Long id, Asset assetDetails) {
        return assetRepository.findById(id).map(asset -> {
            asset.setName(assetDetails.getName());
            asset.setStatus(assetDetails.getStatus());
            return assetRepository.save(asset);
        }).orElseThrow(() -> new RuntimeException("Asset not found"));
    }
}
