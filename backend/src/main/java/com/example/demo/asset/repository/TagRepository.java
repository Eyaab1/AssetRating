package com.example.demo.asset.repository;

import com.example.demo.asset.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TagRepository extends JpaRepository<Tag, Long> {
}
