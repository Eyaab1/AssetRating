package com.example.demo.asset.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.example.demo.asset.model.Asset;
import com.example.demo.asset.model.Framework;
import com.example.demo.asset.model.Status;
import com.example.demo.asset.model.Tag;

@Repository
public interface AssetRepository extends JpaRepository<Asset, String> {
	@Query("SELECT DISTINCT a FROM Asset a LEFT JOIN FETCH a.releases")
    List<Asset> findAllWithReleases();
    Optional<Asset> findByName(String name);
    @Query("SELECT a FROM Asset a " +
    	       "JOIN a.tags t " +
    	       "WHERE (:tag IS NULL OR t.name = :tag) " +
    	       "AND (:framework IS NULL OR a.framework = :framework) " +
    	       "AND (:status IS NULL OR a.status = :status)")
    	List<Asset> filterAssets(@Param("tag") Tag tag,
    	                         @Param("framework") Framework framework,
    	                         @Param("status") Status status);
    
    //get assets that have the same category 
    @Query("SELECT a FROM Asset a JOIN a.categories c WHERE c.id = :categoryId")
    List<Asset> findAssetsByCategoryId(@Param("categoryId") Long categoryId);


}
