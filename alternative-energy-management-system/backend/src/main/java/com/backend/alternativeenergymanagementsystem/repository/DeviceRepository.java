package com.backend.alternativeenergymanagementsystem.repository;

import com.backend.alternativeenergymanagementsystem.model.Device;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

import static com.google.firebase.cloud.FirestoreClient.getFirestore;

@Repository
public class DeviceRepository {

    private static final String COLLECTION_NAME = "devices";

    public Device save(Device device) throws ExecutionException, InterruptedException {
        Firestore firestore = getFirestore();
        if (device.getId() == null) {

            DocumentReference docRef = firestore.collection(COLLECTION_NAME).document();
            device.setId(docRef.getId());
        }

        ApiFuture<WriteResult> result = firestore.collection(COLLECTION_NAME)
                .document(device.getId())
                .set(device);

        result.get();
        return device;
    }

    public Device findById(String id) throws ExecutionException, InterruptedException {
        Firestore firestore = getFirestore();
        DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(id);
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot document = future.get();

        if (document.exists()) {
            return document.toObject(Device.class);
        }
        return null;
    }

    public List<Device> findByUserId(String userId) throws ExecutionException, InterruptedException {
        Firestore firestore = getFirestore();
        Query query = firestore.collection(COLLECTION_NAME).whereEqualTo("userId", userId);
        ApiFuture<QuerySnapshot> future = query.get();

        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        List<Device> devices = new ArrayList<>();

        for (DocumentSnapshot document : documents) {
            devices.add(document.toObject(Device.class));
        }
        return devices;
    }

    public List<Device> findAll() throws ExecutionException, InterruptedException {
        ApiFuture<QuerySnapshot> future = getFirestore().collection(COLLECTION_NAME).get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        List<Device> entities = new ArrayList<>();
        for (DocumentSnapshot document : documents) {
            entities.add(document.toObject(Device.class));
        }

        return entities;
    }

    public List<Device> findByUserIdAndCategory(String userId, String category)
            throws ExecutionException, InterruptedException {
        Firestore firestore = getFirestore();
        Query query = firestore.collection(COLLECTION_NAME)
                .whereEqualTo("userId", userId)
                .whereEqualTo("category", category);

        ApiFuture<QuerySnapshot> future = query.get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        List<Device> devices = new ArrayList<>();

        for (DocumentSnapshot document : documents) {
            devices.add(document.toObject(Device.class));
        }
        return devices;
    }

    public void delete(String id) throws ExecutionException, InterruptedException {
        Firestore firestore = getFirestore();
        ApiFuture<WriteResult> result = firestore.collection(COLLECTION_NAME).document(id).delete();
        result.get();
    }
}