const asyncHandler = require('express-async-handler')

const User = require('../models/userModel')
const Ticket = require('../models/ticketModel')

// @description Get user ticket
// @route /api/tickets
// @access Private
const getTickets = asyncHandler(async(req, res) => {
    //get user using the id in the jwt
    const user = await User.findById(req.user.id)
    if(!user){
        res.status(401)
        throw new Error('User not found')
    }
    const tickets = await Ticket.find({user: req.user.id})
    res.status(200).json(tickets)
})



// @description Get user ticket
// @route /api/tickets/:id
// @access Private
const getTicket = asyncHandler(async(req, res) => {
    //get user using the id in the jwt
    const user = await User.findById(req.user.id)
    if(!user){
        res.status(401)
        throw new Error('User not found')
    }
    const ticket = await Ticket.findById(req.params.id)
    if(!ticket){
        res.status(404)
        throw new Error('Ticket not found')
    }
    if(ticket.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('Not Authorized')
    }
    res.status(200).json(ticket)
})

// @description Create new ticket
// @route POST/api/tickets
// @access Private
const createTicket = asyncHandler(async(req, res) => {
    const { product, description } = req.body
    if(!product || !description) {
        res.status(400)
        throw new Error('Please add a product and description')
    }
    const user = await User.findById(req.user.id)
    if(!user){
        res.status(401)
        throw new Error('User not found')
    }
    const ticket = await Ticket.create({
        product,
        description,
        user: req.user.id,
        status: 'new',
    })
    res.status(201).json(ticket)
})

// @description delete ticket
// @route DELETE /api/tickets/:id
// @access Private
const deleteTicket = asyncHandler(async(req, res) => {
    //get user using the id in the jwt
    const user = await User.findById(req.user.id)
    if(!user){
        res.status(401)
        throw new Error('User not found')
    }
    const ticket = await Ticket.findById(req.params.id)
    if(!ticket){
        res.status(404)
        throw new Error('Ticket not found')
    }
    if(ticket.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('Not Authorized')
    }
    await ticket.remove()
    res.status(200).json({success: true})
})


// @description UPDATE ticket
// @route PUT /api/tickets/:id
// @access Private
const updateTicket = asyncHandler(async(req, res) => {
    //get user using the id in the jwt
    try {
        const user = await User.findById(req.user.id)
        if(!user){
            //res.status(401)
            throw new Error('User not found')
        }
        const ticket = await Ticket.findById(req.params.id)
        if(!ticket){
            //res.status(404)
            throw new Error('Ticket not found')
        }
        if(ticket.user.toString() !== req.user.id) {
            //res.status(401)
            throw new Error('Not Authorized')
        }
        const updatedTicket = await Ticket.findByIdAndUpdate(
            req.param.id, 
            {$set:req.body}, 
            { new: true }
        )
        
        res.status(200).json(updatedTicket)
    } catch(err) {res.status(400).json({'error' : err.toString()})}
    
})



module.exports = {
    getTickets,
    getTicket,
    createTicket,
    deleteTicket,
    updateTicket,
}
