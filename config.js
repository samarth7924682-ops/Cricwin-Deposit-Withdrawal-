const AppConfig = {
    appName: "Cricwin Online Book",
    
    // --- Telegram Backup (इसे खाली छोड़ रहे हैं ताकि Admin Panel वाला ही चले) ---
    telegram: {
        botToken: "", 
        chatId: ""    
    },
    
    // --- Cloudinary Configuration ---
    cloudinary: {
        cloudName: "dcbnhbnoi",
        uploadPreset: "my_preset"
    },

    // --- Firebase Configuration ---
    firebaseConfig: {
        apiKey: "AIzaSyCZ_70ZUSYbxrv-KR2g2X9vhaEN", 
        authDomain: "my-payment-site-dd7d2.firebaseapp.com",
        databaseURL: "https://my-payment-site-dd7d2-default-rtdb.firebaseio.com",
        projectId: "my-payment-site-dd7d2",
        storageBucket: "my-payment-site-dd7d2.firebasestorage.app",
        messagingSenderId: "355379135558",
        appId: "1:355379135558:web:cd28f441a3f03e",
        measurementId: "G-0Z6XDTY7K2"
    },

    // --- Telegram Notification Function ---
    sendTelegram: async function(message) {
        try {
            // Admin Panel के 'settings/app_config' पाथ से डेटा उठाना
            const snapshot = await firebase.database().ref('settings/app_config').once('value');
            const liveData = snapshot.val();

            // .trim() लगाया है ताकि स्पेस वाली एरर न आए
            const activeToken = (liveData && liveData.botToken) ? liveData.botToken.trim() : "";
            const activeChatId = (liveData && liveData.chatId) ? liveData.chatId.toString().trim() : "";

            if (!activeToken || !activeChatId) {
                console.warn("⚠️ Admin Panel में Bot Token या Chat ID खाली है!");
                return;
            }

            const url = `https://api.telegram.org/bot${activeToken}/sendMessage`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: activeChatId,
                    text: message,
                    parse_mode: 'HTML'
                })
            });

            if(response.ok) {
                console.log("✅ Message sent to New Bot!");
            } else {
                console.error("❌ TG Error:", await response.text());
            }
        } catch (error) {
            console.error("❌ Connection Error:", error);
        }
    },

    // --- Cloudinary Upload Function ---
    uploadScreenshot: async function(file) {
        if (!file) throw new Error("No file selected");
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', this.cloudinary.uploadPreset);
        
        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${this.cloudinary.cloudName}/image/upload`, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error("Cloudinary Error:", error);
            throw error;
        }
    }
};