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

def check_cnic(text):
    digits = text.replace("-", "").replace(" ", "")
    if digits == "":
        return None, "CNIC cannot be empty. Example: 35202-1234567-1"
    if not re.fullmatch(r"\d{13}", digits):
        return None, f"CNIC must contain exactly 13 digits (you entered {len(digits)}). Example: 35202-1234567-1"
    return f"{digits[:5]}-{digits[5:12]}-{digits[12:]}", None

def check_category(text):
    categories = {"1": "Student", "2": "Faculty / Staff", "3": "General Visitor"}
    if text == "":
        return None, "Category choice cannot be empty. Enter 1, 2, or 3."
    if text not in categories:
        return None, f"'{text}' is not a valid option. Please choose 1 for Student, 2 for Faculty, or 3 for Visitor."
    return categories[text], None

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

def main():
    print("=== City Central Library Membership Registration ===")
    print("Type each answer and press Enter. Hints are shown in brackets.\n")
    
    name = ask(1, "Full Name", "letters only", check_name)
    cnic = ask(2, "CNIC Number", "13 digits, e.g. 35202-1234567-1", check_cnic)
    
    print("\n  Membership Categories:")
    print("    1) Student")
    print("    2) Faculty / Staff")
    print("    3) General Visitor")
    category = ask(3, "Select Category", "enter 1, 2, or 3", check_category)
    
    email = ask(4, "Email Address", "name@site.com", check_email)
    phone = ask(5, "Phone Number", "03XX-XXXXXXX", check_phone)
    
    print("\n--- Please review your submitted details ---")
    print(f"  Name     : {name}")
    print(f"  CNIC     : {cnic}")
    print(f"  Category : {category}")
    print(f"  Email    : {email}")
    print(f"  Phone    : {phone}")
    print("\n[OK] Library membership application registered successfully! Welcome aboard.")

if __name__ == "__main__":
    main()