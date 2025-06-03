package com.pickle.backend.ai.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "content")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Content {
    @Id
    @Column(name = "id", nullable = false)
    private Long id;

    @NotBlank(message = "Title is mandatory")
    @Column(name = "title")
    private String title;

    @NotBlank(message = "Tags are mandatory")
    @Column(name = "tags")
    private String tags;

    @NotBlank(message = "URL is mandatory")
    @Column(name = "url")
    private String url;
}