import { table, getMinifiedRecords } from "@/lib/airtable";

const createCoffeeStore = async (req, res) => {
  if (req.method === "POST") {
    const { id, name, address, distance, voting, imgUrl } = req.body;

    try {
      if (id) {
        // find a record
        const findCoffeeStoreRecords = await table
          .select({
            filterByFormula: `id="${id}"`,
          })
          .firstPage();

        if (findCoffeeStoreRecords.length !== 0) {
          const records = getMinifiedRecords(findCoffeeStoreRecords);
          res.json(records);
        } else {
          // create a record
          if (name) {
            const createRecords = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  distance,
                  voting,
                  imgUrl,
                },
              },
            ]);

            const records = getMinifiedRecords(createRecords);

            res.status(201);
            res.json(records);
          } else {
            res.status(400);
            res.json({ message: "Id or name is missing" });
          }
        }

        res.json({ message: "Hi Helen! It's POST" });
      } else {
        res.status(400);
        res.json({ message: "Id is missing" });
      }
    } catch (err) {
      console.error("Error creating or finding a store", err);
      res.status(500);
      res.json({ message: "Error creating or finding a store", err });
    }
  }
};

export default createCoffeeStore;
