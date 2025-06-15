package com.backend.alternativeenergymanagementsystem.repository;

import com.backend.alternativeenergymanagementsystem.model.SolarPanel;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

import static com.google.firebase.cloud.FirestoreClient.getFirestore;

@Repository
public class SolarPanelRepository {

    private static final String COLLECTION_NAME = "solar_panels";

    public SolarPanel save(SolarPanel panel) throws ExecutionException, InterruptedException {
        Firestore firestore = FirestoreClient.getFirestore();
        if (panel.getId() == null) {
            DocumentReference docRef = firestore.collection(COLLECTION_NAME).document();
            panel.setId(docRef.getId());
        }

        ApiFuture<WriteResult> result = firestore.collection(COLLECTION_NAME)
                .document(panel.getId())
                .set(panel);

        result.get();
        return panel;
    }

    public SolarPanel findById(String id) throws ExecutionException, InterruptedException {
        Firestore firestore = FirestoreClient.getFirestore();
        DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(id);
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot document = future.get();

        if (document.exists()) {
            return document.toObject(SolarPanel.class);
        }
        return null;
    }

    public List<SolarPanel> findAll() throws ExecutionException, InterruptedException {
        ApiFuture<QuerySnapshot> future = getFirestore().collection(COLLECTION_NAME).get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        List<SolarPanel> entities = new ArrayList<>();
        for (DocumentSnapshot document : documents) {
            entities.add(document.toObject(SolarPanel.class));
        }

        return entities;
    }

    public List<SolarPanel> findByUserId(String userId) throws ExecutionException, InterruptedException {
        Firestore firestore = FirestoreClient.getFirestore();
        Query query = firestore.collection(COLLECTION_NAME).whereEqualTo("userId", userId);
        ApiFuture<QuerySnapshot> future = query.get();

        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        List<SolarPanel> panels = new ArrayList<>();

        for (DocumentSnapshot document : documents) {
            panels.add(document.toObject(SolarPanel.class));
        }
        return panels;
    }

    public void delete(String id) throws ExecutionException, InterruptedException {
        Firestore firestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> result = firestore.collection(COLLECTION_NAME).document(id).delete();
        result.get();
    }
}
