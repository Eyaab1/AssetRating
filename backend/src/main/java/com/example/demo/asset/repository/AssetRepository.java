package com.example.demo.asset.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.analytics.TopRatedDTO;
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
    List<Asset> findByPublisher(String publisher);
    
    //get assets that have the same category 
    @Query("SELECT a FROM Asset a JOIN a.categories c WHERE c.id = :categoryId")
    List<Asset> findAssetsByCategoryId(@Param("categoryId") Long categoryId);
    
    
    //topRtaed categ
    @Query("""
    	    SELECT new com.example.demo.analytics.TopRatedDTO(
    	        c.name,
    	        AVG((r.functionalityScore + r.performanceScore + r.integrationScore + r.documentationScore) / 4.0)
    	    )
    	    FROM Asset a
    	    JOIN a.categories c
    	    JOIN Rating r ON a.id = r.assetId
    	    GROUP BY c.name
    	    ORDER BY 2 DESC
    	""")
    	List<TopRatedDTO> findTopRatedCategory();


   	//topTag
    @Query("""
    	    SELECT new com.example.demo.analytics.TopRatedDTO(
    	        t.name,
    	        AVG((r.functionalityScore + r.performanceScore + r.integrationScore + r.documentationScore) / 4.0)
    	    )
    	    FROM Asset a
    	    JOIN a.tags t
    	    JOIN Rating r ON a.id = r.assetId
    	    GROUP BY t.name
    	    ORDER BY 2 DESC
    	""")
    	List<TopRatedDTO> findTopRatedTag();
 //testing something 
    @Query("""
SELECT new com.example.demo.analytics.TopRatedDTO(
    	        c.name,
    	        AVG((r.functionalityScore + r.performanceScore + r.integrationScore + r.documentationScore) / 4.0)
    	    )
    	    FROM Asset a
    	    JOIN a.categories c
    	    JOIN Rating r ON a.id = r.assetId
    	    GROUP BY c.name
    	    ORDER BY 2 DESC
    	""")
    	List<TopRatedDTO> findAllRatedCategories();
    @Query("""
    	    SELECT new com.example.demo.analytics.TopRatedDTO(
    	        t.name,
    	        AVG((r.functionalityScore + r.performanceScore + r.integrationScore + r.documentationScore) / 4.0)
    	    )
    	    FROM Asset a
    	    JOIN a.tags t
    	    JOIN Rating r ON a.id = r.assetId
    	    GROUP BY t.name
    	    ORDER BY 2 DESC
    	""")
    	List<TopRatedDTO> findAllRatedTags();

    @Query("""
    	    SELECT new com.example.demo.analytics.TopRatedDTO(
    	        a.name,
    	        AVG((r.functionalityScore + r.performanceScore + r.integrationScore + r.documentationScore) / 4.0)
    	    )
    	    FROM Rating r
    	    JOIN Asset a ON a.id = r.assetId
    	    GROUP BY a.name
    	    ORDER BY AVG((r.functionalityScore + r.performanceScore + r.integrationScore + r.documentationScore) / 4.0) DESC
    	""")
    	List<TopRatedDTO> findTopRatedAssets();


    	@Query("SELECT a.status, COUNT(a) FROM Asset a GROUP BY a.status")
    	List<Object[]> countAssetsByStatus();

    	@Query(value = "SELECT * FROM asset WHERE UPPER(asset_type) = :type", nativeQuery = true)
    	List<Asset> findByType(@Param("type") String type);
    	
    	@Query("SELECT DISTINCT a.name FROM Asset a WHERE UPPER(TYPE(a)) = UPPER(:type)")
    	List<String> findDistinctNamesByType(@Param("type") String type);

    	@Query("SELECT DISTINCT a.publisher FROM Asset a WHERE UPPER(TYPE(a)) = UPPER(:type)")
    	List<String> findDistinctPublishersByType(@Param("type") String type);

}
