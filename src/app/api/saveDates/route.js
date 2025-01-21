import dbConnect from "../../../lib/mongodb";
import Event from "../../../models/event";

export const POST = async (req) => {
  const requ = await req.json();

  try {
    await dbConnect();

    await Event.deleteMany({});

    const events = requ.dates.map((date) => ({ date: new Date(date) }));
    await Event.insertMany(events);

    Response.json({ message: "Dates saved successfully" });
  } catch (error) {
    console.error("Failed to save dates:", error);
  }

  return Response.json({ text: "Successful" });
};
