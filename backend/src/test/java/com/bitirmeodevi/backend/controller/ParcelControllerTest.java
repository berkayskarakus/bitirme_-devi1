package com.bitirmeodevi.backend.controller;

import com.bitirmeodevi.backend.repository.ParcelRepository;
import com.bitirmeodevi.backend.service.ParcelService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class ParcelControllerTest {

    private MockMvc mockMvc;
    private ParcelRepository repository;

    private static final String GEO_JSON = """
            {
              "type": "Polygon",
              "ownerUsername": "mahmut",
              "coordinates": [
                [
                  [34.63, 36.8],
                  [34.631, 36.8],
                  [34.631, 36.801],
                  [34.63, 36.801],
                  [34.63, 36.8]
                ]
              ]
            }
            """;

    @BeforeEach
    void setUp() {
        repository = new ParcelRepository();
        ParcelService service = new ParcelService(repository);

        mockMvc = MockMvcBuilders
                .standaloneSetup(new ParcelController(service))
                .build();
    }

    @Test
    void ownerCanReadOwnParcel() throws Exception {
        String id = createParcelAs("mehmet");

        mockMvc.perform(get("/api/parcels/{id}", id)
                        .principal(() -> "mehmet"))
                .andExpect(status().isOk());
    }

    @Test
    void anotherUserCannotReadParcel() throws Exception {
        String id = createParcelAs("mehmet");

        mockMvc.perform(get("/api/parcels/{id}", id)
                        .principal(() -> "mahmut"))
                .andExpect(status().isNotFound());
    }

    @Test
    void listsContainOnlyUsersOwnParcels() throws Exception {
        String mehmetId = createParcelAs("mehmet");
        String mahmutId = createParcelAs("mahmut");

        String mehmetList = mockMvc.perform(get("/api/parcels")
                        .principal(() -> "mehmet"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        assertTrue(mehmetList.contains(mehmetId));
        assertFalse(mehmetList.contains(mahmutId));

        String mahmutList = mockMvc.perform(get("/api/parcels")
                        .principal(() -> "mahmut"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        assertTrue(mahmutList.contains(mahmutId));
        assertFalse(mahmutList.contains(mehmetId));
    }

    @Test
    void requestsWithoutPrincipalAreRejected() throws Exception {
        String id = createParcelAs("mehmet");

        mockMvc.perform(get("/api/parcels/{id}", id))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/parcels"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/parcels")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(GEO_JSON))
                .andExpect(status().isUnauthorized());
    }

    private String createParcelAs(String username) throws Exception {
        mockMvc.perform(post("/api/parcels")
                        .principal(() -> username)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(GEO_JSON))
                .andExpect(status().isCreated());

        return repository.findAllByOwnerUsername(username)
                .get(0)
                .getId()
                .toString();
    }
}