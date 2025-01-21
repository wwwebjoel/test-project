import dbConnect from "../../../lib/mongodb";
import Event from "../../../models/event";



export const GET = async () => {

  await dbConnect();

  try {
    const events = await Event.find({});

   
    const dates = events.map(event => ({
      date: event.date,
      completed: event.completed
    }));
  
   return Response.json({dates})
  } catch (error) {
    return Response.json({ text: error});
  }
  
}