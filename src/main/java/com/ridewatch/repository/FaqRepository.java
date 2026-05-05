package com.ridewatch.repository;

import com.ridewatch.model.Faq;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FaqRepository extends JpaRepository<Faq, Long> {
    List<Faq> findByCategoryOrderByDisplayOrderAsc(String category);
    List<Faq> findAllByOrderByCategoryAscDisplayOrderAsc();
}
