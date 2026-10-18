print("Welcome to University Tuition Fee Calculator")

name = input("Enter student name: ")
credit_hours = int(input("Enter credit hours: "))
fee_per_hour = float(input("Enter fee per credit hour (Rs): "))
other_charges = float(input("Enter additional charges (Rs): "))

tuition_fee = credit_hours * fee_per_hour
total_fee = tuition_fee + other_charges

print("\n--- Fee Summary ---")
print("Student Name:", name)
print("Tuition Fee: Rs", tuition_fee)
print("Additional Charges: Rs", other_charges)
print("Total Fee: Rs", total_fee)

print("Thank you for using the fee calculator!")

# HCI Reflection
# 1. Clear prompts help users understand what information to enter.
#    Meaningful labels make the output easy to understand.
#
# 2. Entering text instead of a number causes a ValueError.
#    Input validation can prevent the program from stopping.