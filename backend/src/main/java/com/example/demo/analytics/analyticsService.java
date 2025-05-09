package com.example.demo.analytics;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.demo.asset.model.Status;
import com.example.demo.asset.repository.AssetRepository;


@Service
public class analyticsService {
	private final AssetRepository assetRepository;

    public analyticsService(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    public TopRatedDTO getTopRatedCategory() {
        List<TopRatedDTO> results = assetRepository.findTopRatedCategory();
        return results.isEmpty() ? new TopRatedDTO("N/A", 0.0) : results.get(0);
    }


    public TopRatedDTO getTopRatedTag() {
        List<TopRatedDTO> results = assetRepository.findTopRatedTag();
        return results.isEmpty() ? new TopRatedDTO("N/A", 0.0) : results.get(0);
    }
    public List <TopRatedDTO> getalltopRatedCatg() {
    	List <TopRatedDTO> results=assetRepository.findAllRatedCategories();
        if( results.isEmpty()) {
        	return null;
        }else {
        	return results;
        }
    }
    public List <TopRatedDTO> getalltopRatedTags() {
    	List <TopRatedDTO> results=assetRepository.findAllRatedTags();
        if( results.isEmpty()) {
        	return null;
        }else {
        	return results;
        }
    }
    public List<TopRatedDTO> getTopRatedAssets() {
        return assetRepository.findTopRatedAssets(); // You will define this query below
    }

    public Map<String, Long> getAssetStatusDistribution() {
        List<Object[]> results = assetRepository.countAssetsByStatus();
        Map<String, Long> statusCountMap = new HashMap<>();
        for (Object[] row : results) {
            Status status = (Status) row[0];     // Safely cast to enum
            Long count = (Long) row[1];
            statusCountMap.put(status.name(), count);  // Convert enum to String
        }
        return statusCountMap;
    }


}
