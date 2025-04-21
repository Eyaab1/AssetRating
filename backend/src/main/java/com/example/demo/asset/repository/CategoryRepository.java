package com.example.demo.asset.repository;

import com.example.demo.asset.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
