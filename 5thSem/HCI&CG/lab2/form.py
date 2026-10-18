import re

TOTAL_STEPS = 5

def ask(step, label, hint, validator):
    """Keep asking until validator(text) returns (value, None).
    validator returns (value, error_message). error_message is None when valid."""
    while True:
        text = input(f"[Step {step} of {TOTAL_STEPS}] {label} ({hint}): ").strip()
        value, error = validator(text)
        if error is None:
            return value
        print(f"  [X] {error}")

def check_name(text):
    if text == "":
        return None, "Name cannot be empty. Please type your full name, for example Ayesha Khan."
    if len(text) < 2 or len(text) > 50:
        return None, f"Name has {len(text)} characters. It should be between 2 and 50."
    if not re.fullmatch(r"[A-Za-z ]+", text):
        return None, "Name may contain letters and spaces only. Remove digits or symbols."
    return text.title(), None

def check_age(text):
    if text == "":
        return None, "Age cannot be empty. Please type a number such as 25."
    if not text.isdigit():
        return None, f"'{text}' is not a whole number. Use digits only, for example 25."
    age = int(text)
    if age < 18 or age > 65:
        return None, f"{age} is outside the allowed range. Please enter a value from 18 to 65."
    return age, None

def check_email(text):
    if text == "":
        return None, "Email cannot be empty. Example: ayesha@example.com"
    if "@" not in text:
        return None, "Email must contain the @ symbol. Example: ayesha@example.com"
    if not re.fullmatch(r"[\w.+-]+@[\w-]+(\.[\w-]+)+", text):
        return None, "Email looks incomplete. Use the pattern name@site.com"
    return text.lower(), None

def check_phone(text):
    digits = text.replace("-", "").replace(" ", "")
    if digits == "":
        return None, "Phone number cannot be empty. Example: 0300-1234567"
    if not re.fullmatch(r"03\d{9}", digits):
        return None, "Phone must start with 03 and have 11 digits in total. Example: 0300-1234567"
    return f"{digits[:4]}-{digits[4:]}", None

def check_password(text):
    problems = []
    if len(text) < 8:
        problems.append("at least 8 characters")
    if not re.search(r"[A-Z]", text):
        problems.append("one capital letter")
    if not re.search(r"\d", text):
        problems.append("one digit")
    if problems:
        return None, "Password still needs: " + ", ".join(problems) + "."
    return text, None

def main():
    print("=== Student Registration ===")
    print("Type each answer and press Enter. Hints are shown in brackets.\n")
    
    name = ask(1, "Full name", "letters only", check_name)
    age = ask(2, "Age", "18-65", check_age)
    email = ask(3, "Email", "name@site.com", check_email)
    phone = ask(4, "Phone", "03XX-XXXXXXX", check_phone)
    
    # Step 5 has a cross-field check, so it uses its own small loop
    while True:
        password = ask(5, "Password", "8+ chars, 1 capital, 1 digit", check_password)
        confirm = input("        Confirm password: ").strip()
        if confirm == password:
            break
        print("  [X] The two passwords do not match. Please enter them again.")
        
    print("\n--- Please check your details ---")
    print(f"  Name  : {name}")
    print(f"  Age   : {age}")
    print(f"  Email : {email}")
    print(f"  Phone : {phone}")
    print(f"  Password: {'*' * len(password)}")
    print("\n[OK] Registration complete. Thank you!")

if __name__ == "__main__":
    main()
