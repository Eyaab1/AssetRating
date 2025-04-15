package com.example.demo.asset.repository;

import com.example.demo.asset.model.AssetReleases;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssetReleaseRepository extends JpaRepository<AssetReleases, Long> {
}
