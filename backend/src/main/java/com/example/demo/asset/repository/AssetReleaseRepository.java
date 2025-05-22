package com.example.demo.asset.repository;

import com.example.demo.asset.model.AssetReleases;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AssetReleaseRepository extends JpaRepository<AssetReleases, Long> {
	@Query(value = "SELECT CAST(released_asset_id AS text) FROM asset_releases", nativeQuery = true)
	List<String> findAllReleasedAssetIds();


}
