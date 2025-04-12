package com.example.demo.asset.service;

import com.example.demo.asset.model.Asset;
import com.example.demo.asset.repository.AssetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AssetService {

    private final AssetRepository assetRepository;

    @Autowired
    public AssetService(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    public Asset saveAsset(Asset asset) {
        return assetRepository.save(asset);
    }

    public List<Asset> getAllAssets() {
        return assetRepository.findAll();
    }

    public Optional<Asset> getAssetById(String id) {
        return assetRepository.findById(id);
    }

    public void deleteAsset(String id) {
        assetRepository.deleteById(id);
    }

    public Asset updateAsset(String id, Asset updatedAsset) {
        return assetRepository.findById(id)
                .map(asset -> {
                    asset.setName(updatedAsset.getName());
                    asset.setLabel(updatedAsset.getLabel());
                    asset.setPublisher(updatedAsset.getPublisher());
                    asset.setPublisherMail(updatedAsset.getPublisherMail());
                    asset.setPublishDate(updatedAsset.getPublishDate());
                    asset.setLicense(updatedAsset.getLicense());
                    asset.setStatus(updatedAsset.getStatus());
                    asset.setImage(updatedAsset.getImage());
                    asset.setDescription(updatedAsset.getDescription());
                    asset.setDocumentation(updatedAsset.getDocumentation());
                    asset.setAssetType(updatedAsset.getAssetType());
                    asset.setTags(updatedAsset.getTags());
                    asset.setCategories(updatedAsset.getCategories());
                    return assetRepository.save(asset);
                })
                .orElseThrow(() -> new RuntimeException("Asset not found with id: " + id));
    }
}
