import re
import tkinter as tk
from tkinter import messagebox, ttk


# Validation logic
def submit():
    # Required check (*)
    if (
        not entry_name.get().strip()
        or not entry_reg.get().strip()
        or not entry_class.get().strip()
        or not entry_section.get().strip()
        or not entry_email.get().strip()
        or not entry_pass.get()
    ):
        messagebox.showerror(
            "Error", "Please fill all required fields marked with (*)."
        )
        return

    # Email format check
    if not re.match(r"^[\w\.-]+@[\w\.-]+\.\w+$", entry_email.get().strip()):
        messagebox.showerror(
            "Error", "Invalid email format. Example: student@example.com"
        )
        return

    # Password match check
    if entry_pass.get() != entry_confirm.get():
        messagebox.showerror("Error", "Passwords do not match.")
        return

    messagebox.showinfo(
        "Success",
        f"Registration Successful!\nWelcome {entry_name.get().strip()}.",
    )


# Reset logic
def reset():
    for entry in [
        entry_name,
        entry_dob,
        entry_addr,
        entry_reg,
        entry_class,
        entry_section,
        entry_email,
        entry_phone,
        entry_pass,
        entry_confirm,
    ]:
        entry.delete(0, tk.END)
    gender_var.set("")


# Window setup
root = tk.Tk()
root.title("Student Registration Portal")
root.geometry("450x580")
root.resizable(False, False)

# Main Title
tk.Label(
    root, text="STUDENT REGISTRATION PORTAL", font=("Arial", 12, "bold")
).pack(pady=(10, 5))


def sec_header(text):
    tk.Label(
        root, text=text, font=("Arial", 9, "bold"), fg="blue", anchor="w"
    ).pack(fill="x", padx=15, pady=(8, 2))


# --- PERSONAL INFORMATION ---
sec_header("PERSONAL INFORMATION")
f1 = tk.Frame(root)
f1.pack(fill="x", padx=15)

tk.Label(f1, text="Full Name *", width=15, anchor="w").grid(
    row=0, column=0, pady=2
)
entry_name = tk.Entry(f1, width=30)
entry_name.grid(row=0, column=1, pady=2)

tk.Label(f1, text="Date of Birth 📅", width=15, anchor="w").grid(
    row=1, column=0, pady=2
)
entry_dob = tk.Entry(f1, width=30)
entry_dob.grid(row=1, column=1, pady=2)

tk.Label(f1, text="Address", width=15, anchor="w").grid(row=2, column=0, pady=2)
entry_addr = tk.Entry(f1, width=30)
entry_addr.grid(row=2, column=1, pady=2)

tk.Label(f1, text="Gender", width=15, anchor="w").grid(row=3, column=0, pady=2)
f_g = tk.Frame(f1)
f_g.grid(row=3, column=1, sticky="w")
gender_var = tk.StringVar()
tk.Radiobutton(
    f_g, text="MALE", variable=gender_var, value="Male"
).pack(side="left")
tk.Radiobutton(
    f_g, text="FEMALE", variable=gender_var, value="Female"
).pack(side="left")

# --- ACADEMIC DETAILS ---
sec_header("ACADEMIC DETAILS")
f2 = tk.Frame(root)
f2.pack(fill="x", padx=15)

tk.Label(f2, text="Reg No. *", width=15, anchor="w").grid(
    row=0, column=0, pady=2
)
entry_reg = tk.Entry(f2, width=30)
entry_reg.grid(row=0, column=1, pady=2)

tk.Label(f2, text="Class/Batch *", width=15, anchor="w").grid(
    row=1, column=0, pady=2
)
entry_class = tk.Entry(f2, width=30)
entry_class.grid(row=1, column=1, pady=2)

tk.Label(f2, text="Section *", width=15, anchor="w").grid(
    row=2, column=0, pady=2
)
entry_section = tk.Entry(f2, width=30)
entry_section.grid(row=2, column=1, pady=2)

# --- CONTACT & SECURITY ---
sec_header("CONTACT & SECURITY")
f3 = tk.Frame(root)
f3.pack(fill="x", padx=15)

tk.Label(f3, text="Email *", width=15, anchor="w").grid(
    row=0, column=0, pady=2
)
entry_email = tk.Entry(f3, width=30)
entry_email.grid(row=0, column=1, pady=2)

tk.Label(f3, text="Ph. no", width=15, anchor="w").grid(row=1, column=0, pady=2)
entry_phone = tk.Entry(f3, width=30)
entry_phone.grid(row=1, column=1, pady=2)

tk.Label(f3, text="Create Password *", width=15, anchor="w").grid(
    row=2, column=0, pady=2
)
entry_pass = tk.Entry(f3, show="*", width=30)
entry_pass.grid(row=2, column=1, pady=2)

tk.Label(f3, text="Confirm Password", width=15, anchor="w").grid(
    row=3, column=0, pady=2
)
entry_confirm = tk.Entry(f3, show="*", width=30)
entry_confirm.grid(row=3, column=1, pady=2)

# --- BUTTONS ---
f_btn = tk.Frame(root)
f_btn.pack(pady=15)

tk.Button(
    f_btn,
    text="Submit Registration",
    bg="#16A34A",
    fg="white",
    width=18,
    command=submit,
).pack(side="left", padx=5)
tk.Button(
    f_btn, text="Reset all fields", width=15, command=reset
).pack(side="left", padx=5)

root.mainloop()