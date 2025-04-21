// CategoryService.java
package com.example.demo.asset.service;

import com.example.demo.asset.model.Category;
import com.example.demo.asset.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    public Category create(Category category) {
        return categoryRepository.save(category);
    }

    public void delete(Long id) {
        categoryRepository.deleteById(id);
    }
    public List<Category> findAllById(List<Long> ids) {
        return categoryRepository.findAllById(ids);
    }
}
