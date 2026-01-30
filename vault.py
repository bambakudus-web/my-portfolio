from cryptography.fernet import Fernet
import json
import os

# 1. Handle the "Master Key" (Secret Handshake)
def load_key():
    if not os.path.exists("secret.key"):
        key = Fernet.generate_key()
        with open("secret.key", "wb") as key_file:
            key_file.write(key)
    return open("secret.key", "rb").read()

# 2. Encrypt and Decrypt Functions
key = load_key()
fernet = Fernet(key)

def save_password(site, password):
    encrypted = fernet.encrypt(password.encode()).decode()
    data = {}
    if os.path.exists("passwords.json"):
        with open("passwords.json", "r") as f:
            data = json.load(f)
    
    data[site] = encrypted
    with open("passwords.json", "w") as f:
        json.dump(data, f)
    print(f"✅ Password for {site} saved securely!")

def get_password(site):
    if os.path.exists("passwords.json"):
        with open("passwords.json", "r") as f:
            data = json.load(f)
            if site in data:
                decrypted = fernet.decrypt(data[site].encode()).decode()
                print(f"🔑 Password for {site}: {decrypted}")
            else:
                print("❌ Site not found.")

# 3. Simple Interface
print("--- Kelly's Secure Vault ---")
choice = input("Would you like to (S)ave or (G)et a password? ").upper()
if choice == "S":
    s = input("Enter Website: ")
    p = input("Enter Password: ")
    save_password(s, p)
elif choice == "G":
    s = input("Enter Website: ")
    get_password(s)