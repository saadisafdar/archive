feedback = [
    {
        "id": 1,
        "complaint": "Semester result show nhi hota, kuch time baad remove ho jata ha",
        "category": "Finding things",
        "rating": 1
    },
    {
        "id": 2,
        "complaint": "Login remember nhi rehta, har dafa credientials dalny party hein",
        "category": "Other",
        "rating": 3
    },
    {
        "id": 3,
        "complaint": "Profile ka proper interface nhi ha, kuch details missing hein",
        "category": "Finding things",
        "rating": 4
    },
    {
        "id": 4,
        "complaint": "Fee voucher downloadable nhi ha, screenshot lena parta ha print karany ky liye",
        "category": "Missing things",
        "rating": 4
    },
    {
        "id": 5,
        "complaint": "Gradebook ky marks final or mid sy phly gaib ho jatay hain",
        "category": "Finding things",
        "rating": 2
    }
]

counts = {}
for item in feedback:
    cat = item["category"]
    counts[cat] = counts.get(cat, 0) + 1

print("Complaints per category:", counts)

# Filter unhappy students (rating <= 2)
print("Unhappy students (rating 2 or below):")
for item in feedback:
    if item["rating"] <= 2:
        print("-", item["complaint"])