
import dbConnect from '../../../lib/mongodb';
import Event from '../../../models/event';



export const POST = async (req) => {
  const requ = await req.json();
 try{
    await dbConnect();

    const { date, completed } = requ;
    const dateObj = new Date(date);
    const result = await Event.updateOne(
            { date: dateObj }, // Find event by date
            { $set: { completed: completed } }, // Set the completion status
            { new: true, upsert: true } // Options to return the new document and create if it does not exist
          );
          if (result.modifiedCount === 0 && result.upsertedCount === 0) {
                    return res.status(404).json({ message: "No matching event found or created" });
                  }
  
  
    return Response.json({ text: "Event marked as complete successfully" });
 }catch{
    return Response.json({ text: "Error" });
 }
};
