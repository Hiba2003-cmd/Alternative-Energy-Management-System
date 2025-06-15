package com.backend.alternativeenergymanagementsystem.service;

import com.backend.alternativeenergymanagementsystem.model.User;
import com.backend.alternativeenergymanagementsystem.repository.UserRepository;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(String name, String email, String password, String location)
            throws FirebaseAuthException, ExecutionException, InterruptedException {
        // Create user in Firebase Authentication
        UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                .setEmail(email)
                .setPassword(password)
                .setDisplayName(name)
                .setEmailVerified(false)
                .setDisabled(false);

        UserRecord userRecord = FirebaseAuth.getInstance().createUser(request);

        // Create user in Firestore
        User user = new User(userRecord.getUid(), name, email, location);
        userRepository.save(user);

        return user;
    }

    public User getUserById(String id) throws ExecutionException, InterruptedException {
        return userRepository.findById(id);
    }

    public User getUserByEmail(String email) throws ExecutionException, InterruptedException {
        return userRepository.findByEmail(email);
    }

    public List<User> getAllUsers() throws ExecutionException, InterruptedException {
        return userRepository.findAll();
    }

    public User updateUser(User user) throws ExecutionException, InterruptedException {
        return userRepository.save(user);
    }

    public void deleteUser(String id) throws FirebaseAuthException, ExecutionException, InterruptedException {
        // Delete from Firebase Authentication
        FirebaseAuth.getInstance().deleteUser(id);

        // Delete from Firestore
        userRepository.delete(id);
    }
}
