// TagService.java
package com.example.demo.asset.service;

import com.example.demo.asset.model.Category;
import com.example.demo.asset.model.Tag;
import com.example.demo.asset.repository.TagRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagService {
    private final TagRepository tagRepository;

    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    public List<Tag> getAll() {
        return tagRepository.findAll();
    }

    public Tag create(Tag tag) {
        return tagRepository.save(tag);
    }

    public void delete(Long id) {
        tagRepository.deleteById(id);
    }
    public List<Tag> findAllById(List<Long> ids) {
        return tagRepository.findAllById(ids);
    }
}
