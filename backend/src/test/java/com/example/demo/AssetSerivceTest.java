package com.example.demo;

import java.util.Date;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;

import static org.mockito.Mockito.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import com.example.demo.asset.model.Asset;
import com.example.demo.asset.model.AssetType;
import com.example.demo.asset.model.License;
import com.example.demo.asset.model.Status;
import com.example.demo.asset.model.Widget;
import com.example.demo.asset.repository.AssetRepository;
import com.example.demo.asset.service.AssetService;

@ExtendWith(MockitoExtension.class)
public class AssetSerivceTest {
    @Mock
    private AssetRepository assetRepository;

    @InjectMocks
    private AssetService assetService;

    @Test
    public void testAddasset() {
      
        Widget asset = new Widget();
        asset.setName("Test Asset");
        asset.setLabel("Test Label");
        asset.setPublisher("John Doe");
        asset.setPublisherMail("john@example.com");
        asset.setDescription("This is a test asset.");
        asset.setLicense(License.FREE);  
        asset.setStatus(Status.PUBLISHED); 
        asset.setDocumentation("manual.pdf");
        asset.setPublishDate(new Date()); 

        when(assetRepository.save(any(Widget.class))).thenReturn(asset);
        Asset saved = assetService.saveAsset(asset);

        assertNotNull(saved);  
        assertEquals("Test Asset", saved.getName()); 

        verify(assetRepository, times(1)).save(any(Widget.class));
    }
}
