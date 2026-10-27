requirements = [
    {
        "req_id": "R1",
        "from_id": 1,
        "text": "The system shall display a semester drop-down menu containing results for up to 8 past semesters."
    },
    {
        "req_id": "R2",
        "from_id": 5,
        "text": "The system shall display gradebook marks for 24 hours a day during midterms and final exams."
    }
]

for r in requirements:
    print(r["req_id"], "(from complaint " + str(r["from_id"]) + "):", r["text"])