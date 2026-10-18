print("=== Welcome to Campus Canteen ===")

customer = input("Customer name: ")
item = input("Item purchased: ")
price = float(input("Price per item (Rs): "))
qty = int(input("Quantity: "))

total = price * qty

print("\n------ Bill ------")
print(f"Customer : {customer}")
print(f"Item     : {item}")
print(f"Total    : Rs {total:.2f}")
print("Thank you, please visit again!")