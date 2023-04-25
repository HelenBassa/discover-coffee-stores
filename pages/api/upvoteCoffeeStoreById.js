import { table, getMinifiedRecords, findRecordByFilter } from "@/lib/airtable";

const upvoteCoffeeStoreById = async (req, res) => {
  if (req.method === "PUT") {
    const { id } = req.body;

    try {
      if (id) {
        const records = await findRecordByFilter(id);

        if (records.length !== 0) {
          const record = records[0];
          const { recordId, voting } = record;

          const calculateVoting = +voting + 1;

          const updateRecord = await table.update([
            {
              id: recordId,
              fields: {
                voting: calculateVoting,
              },
            },
          ]);

          if (updateRecord) {
            const minifiedRecord = getMinifiedRecords(updateRecord);

            res.status(200);
            res.json(minifiedRecord);
          }
        } else {
          res.status(400);
          res.json({ message: "Coffee store id doesn't exist", id });
        }
      } else {
        res.status(400);
        res.json({ message: "Id is missing", id });
      }
    } catch (error) {
      console.error("Error upvoting coffee store", error);
      res.status(500);
      res.json({ message: "Error upvoting coffee store", error });
    }
  }
};

export default upvoteCoffeeStoreById;
