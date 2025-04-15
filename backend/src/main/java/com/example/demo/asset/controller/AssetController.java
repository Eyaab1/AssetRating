package com.example.demo.asset.controller;

import com.example.demo.asset.model.Asset;
import com.example.demo.asset.model.AssetReleases;
import com.example.demo.asset.model.Framework;
import com.example.demo.asset.model.Status;
import com.example.demo.asset.model.Tag;
import com.example.demo.asset.service.AssetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/assets")
@CrossOrigin(origins = "*") // or "http://localhost:4200"
public class AssetController {

    private final AssetService assetService;

    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    @GetMapping
    public ResponseEntity<List<Asset>> getAllAssets() {
        return ResponseEntity.ok(assetService.getAllAssets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Asset> getAssetById(@PathVariable("id") String id) {
        Optional<Asset> asset = assetService.getAssetById(id);
        return asset.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Asset> createAsset(@RequestBody Asset asset) {
        Asset createdAsset = assetService.saveAsset(asset);
        return ResponseEntity.ok(createdAsset);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Asset> updateAsset(@PathVariable("id") String id, @RequestBody Asset asset) {
        return ResponseEntity.ok(assetService.updateAsset(id, asset));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAsset(@PathVariable("id") String id) {
        assetService.deleteAsset(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{assetId}/releases")
    public ResponseEntity<AssetReleases> addRelease(
            @PathVariable("assetId") String assetId,
            @RequestBody AssetReleases release) {
        Asset asset = assetService.getAssetById(assetId)
                .orElseThrow(() -> new RuntimeException("Asset not found"));
        release.setAsset(asset);
        return ResponseEntity.ok(assetService.saveRelease(release));
    }

    @GetMapping("/filter")
    public List<Asset> filterAssets(
        @RequestParam(name = "tag", required = false) Tag tag,
        @RequestParam(name = "framework", required = false) Framework framework,
        @RequestParam(name = "status", required = false) Status status
    ) {
        return assetService.filterAssets(tag, framework, status);
    }

}
