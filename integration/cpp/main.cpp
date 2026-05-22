#include <iostream>
#include <string>
#include <curl/curl.h>
#include <nlohmann/json.hpp>
#include <openssl/hmac.h>
#include <openssl/evp.h>
#include <iomanip>
#include <sstream>

using json = nlohmann::json;

// Helper to convert bytes to hex string
std::string to_hex_string(const unsigned char* data, size_t len) {
    std::stringstream ss;
    ss << std::hex << std::setfill('0');
    for (size_t i = 0; i < len; ++i)
        ss << std::setw(2) << static_cast<int>(data[i]);
    return ss.str();
}

// HMAC-SHA256 Verification
bool verify_signature(const std::string& payload, const std::string& signature, const std::string& secret) {
    unsigned char hash[EVP_MAX_MD_SIZE];
    unsigned int len = 0;

    HMAC(EVP_sha256(), secret.c_str(), secret.length(), 
         reinterpret_cast<const unsigned char*>(payload.c_str()), payload.length(), 
         hash, &len);

    std::string calculated_sig = to_hex_string(hash, len);
    return calculated_sig == signature;
}

// cURL callback to handle response
size_t WriteCallback(void* contents, size_t size, size_t nmemb, void* userp) {
    ((std::string*)userp)->append((char*)contents, size * nmemb);
    return size * nmemb;
}

int main() {
    CURL* curl;
    CURLcode res;
    std::string readBuffer;

    const std::string API_URL = "http://localhost:3000/api/auth/validate";
    const std::string SECRET_KEY = "mrcClient_secret_key_change_me"; // MUST MATCH .env

    curl = curl_easy_init();
    if(curl) {
        json request_data = {
            {"key", "mrcClient-XXXX-XXXX"}, // The user's key
            {"hwid", "UNIQUE_PC_ID_12345"},  // You should generate this from hardware (Disk Serial, CPU ID, etc.)
            {"discord_id", "123456789"}      // Optional
        };

        std::string json_str = request_data.dump();

        struct curl_slist* headers = NULL;
        headers = curl_slist_append(headers, "Content-Type: application/json");

        curl_easy_setopt(curl, CURLOPT_URL, API_URL.c_str());
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, json_str.c_str());
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &readBuffer);

        res = curl_easy_perform(curl);
        
        if(res == CURLE_OK) {
            try {
                auto response = json::parse(readBuffer);

                if (response["success"]) {
                    // 1. Verify Signature to prevent spoofing
                    std::string signature = response["signature"];
                    std::string data_payload = response["data"].dump();

                    if (verify_signature(data_payload, signature, SECRET_KEY)) {
                        std::cout << "[SUCCESS] Authenticated and Signature Verified!" << std::endl;
                        std::cout << "User: " << response["data"]["label"] << std::endl;
                        std::cout << "Expires: " << response["data"]["expires_at"] << std::endl;
                        
                        // Proceed to your application
                    } else {
                        std::cout << "[CRITICAL] Signature Mismatch! Possible tampering detected." << std::endl;
                    }
                } else {
                    std::cout << "[ERROR] Auth Failed: " << response["message"] << std::endl;
                }
            } catch (const std::exception& e) {
                std::cout << "JSON Parse Error: " << e.what() << std::endl;
            }
        } else {
            std::cerr << "curl_easy_perform() failed: " << curl_easy_strerror(res) << std::endl;
        }

        curl_easy_cleanup(curl);
    }

    return 0;
}
