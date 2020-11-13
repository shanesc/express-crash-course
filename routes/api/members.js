const express = require('express');
const router = express.Router();
const members = require('../../Members');
const uuid = require('uuid');

// Get all Members
router.get('/', (req, res) => res.json(members));

// Get single Member
router.get('/:id', (req, res) => {
  const found = members.some(
    (member) => member.id === Number(req.params.id)
  );

  if (found) {
    const member = members.filter((member) => {
      return member.id === Number(req.params.id);
    });
    res.json(member);
  } else {
    res
      .status(400)
      .json({ msg: `no member with ID ${req.params.id} found` });
  }
});

// Create Member
router.post('/', (req, res) => {
  const newMember = {
    id: uuid.v4(),
    name: req.body.name,
    email: req.body.email,
    status: 'active',
  };

  if (!newMember.name || !newMember.email) {
    return res.status(400).json({ msg: 'Name and email required' });
  }

  if (members.some((member) => member.email === newMember.email)) {
    return res.status(400).json({ msg: 'Email already being used' });
  }

  members.push(newMember);
  res.json(members);
  // res.redirect('/');
});

// Update Member
router.put('/:id', (req, res) => {
  const found = members.some(
    (member) => member.id === Number(req.params.id)
  );

  if (found) {
    const updMember = req.body;
    members.forEach((member) => {
      if (member.id === Number(req.params.id)) {
        member.name = updMember.name ? updMember.name : member.name;
        member.email = updMember.email
          ? updMember.email
          : member.email;
        res.json({ msg: 'Member updated', member });
      }
    });
  } else {
    res
      .status(400)
      .json({ msg: `Member with id ${req.params.id} not found` });
  }
});

// Delete Member
router.delete('/:id', (req, res) => {
  const found = members.some((member) => member.id === req.params.id);

  if (found) {
    members.forEach((member, i) => {
      if (member.id === req.params.id) {
        members.splice(i, 1);
      }
    });
    res.json({
      msg: `Member with id ${req.params.id} deleted`,
      members: members,
    });
  } else {
    res
      .status(400)
      .json({ msg: `No member with id ${req.params.id} exists` });
  }
});

module.exports = router;
