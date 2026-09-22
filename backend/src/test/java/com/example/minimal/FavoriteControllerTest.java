package com.example.minimal;

import com.example.minimal.model.Favorite;
import com.example.minimal.model.Product;
import com.example.minimal.model.User;
import com.example.minimal.repository.FavoriteRepository;
import com.example.minimal.repository.ProductRepository;
import com.example.minimal.repository.UserRepository;
import com.example.minimal.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.util.ArrayList;

import static org.hamcrest.Matchers.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Transactional
class FavoriteControllerTest {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    private String userToken;
    private User testUser;
    private Product testProduct1;
    private Product testProduct2;

    @BeforeEach
    void setUp() {
        this.mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();

        favoriteRepository.deleteAll();
        userRepository.deleteAll();
        productRepository.deleteAll();

        testUser = User.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .password(passwordEncoder.encode("Password123!"))
                .role(User.Role.user)
                .emailVerified(true)
                .blocked(false)
                .build();
        testUser = userRepository.save(testUser);

        testProduct1 = Product.builder()
                .name("Silk Cashmere Sweater")
                .slug("silk-cashmere-sweater")
                .price(299.00)
                .image("/uploads/sweater.jpg")
                .category("knitwear")
                .gender("unisex")
                .sizes(new ArrayList<>())
                .details(new ArrayList<>())
                .features(new ArrayList<>())
                .careInstructions(new ArrayList<>())
                .reviews(new ArrayList<>())
                .build();
        testProduct1 = productRepository.save(testProduct1);

        testProduct2 = Product.builder()
                .name("Tailored Wool Trousers")
                .slug("tailored-wool-trousers")
                .price(180.00)
                .image("/uploads/trousers.jpg")
                .category("trousers")
                .gender("men")
                .sizes(new ArrayList<>())
                .details(new ArrayList<>())
                .features(new ArrayList<>())
                .careInstructions(new ArrayList<>())
                .reviews(new ArrayList<>())
                .build();
        testProduct2 = productRepository.save(testProduct2);

        userToken = jwtService.generateToken(
                org.springframework.security.core.userdetails.User.builder()
                        .username(testUser.getEmail())
                        .password(testUser.getPassword())
                        .authorities("ROLE_USER")
                        .build()
        );
    }

    @Test
    void addFavorite_Success() throws Exception {
        mockMvc.perform(post("/api/favorites/" + testProduct1.getId())
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(testProduct1.getId()))
                .andExpect(jsonPath("$.data.name").value("Silk Cashmere Sweater"));

        // Verify in DB
        org.junit.jupiter.api.Assertions.assertTrue(
                favoriteRepository.existsByUserEmailIgnoreCaseAndProductId(testUser.getEmail(), testProduct1.getId())
        );
    }

    @Test
    void getFavorites_Success() throws Exception {
        favoriteRepository.save(Favorite.builder().user(testUser).product(testProduct1).build());
        favoriteRepository.save(Favorite.builder().user(testUser).product(testProduct2).build());

        mockMvc.perform(get("/api/favorites")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(2)));
    }

    @Test
    void getFavoriteIds_Success() throws Exception {
        favoriteRepository.save(Favorite.builder().user(testUser).product(testProduct1).build());

        mockMvc.perform(get("/api/favorites/ids")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0]").value(testProduct1.getId()));
    }

    @Test
    void removeFavorite_Success() throws Exception {
        favoriteRepository.save(Favorite.builder().user(testUser).product(testProduct1).build());

        mockMvc.perform(delete("/api/favorites/" + testProduct1.getId())
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        org.junit.jupiter.api.Assertions.assertFalse(
                favoriteRepository.existsByUserEmailIgnoreCaseAndProductId(testUser.getEmail(), testProduct1.getId())
        );
    }

    @Test
    void toggleFavorite_Success() throws Exception {
        // First toggle: adds to favorite
        mockMvc.perform(post("/api/favorites/" + testProduct1.getId() + "/toggle")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.favorited").value(true));

        // Second toggle: removes from favorite
        mockMvc.perform(post("/api/favorites/" + testProduct1.getId() + "/toggle")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.favorited").value(false));
    }

    @Test
    void favorites_Unauthenticated_ShouldReturnUnauthorized() throws Exception {
        mockMvc.perform(get("/api/favorites"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/favorites/" + testProduct1.getId()))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(delete("/api/favorites/" + testProduct1.getId()))
                .andExpect(status().isUnauthorized());
    }
}
