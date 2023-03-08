const axios = require('axios')
const url = 'https://auth-node-mongo.herokuapp.com/api/user'

describe('testing router', () => {
    test('login with legitimate user', async () => {
      const res = await axios.post(`${url}/login`, {
        email: 'ezaniljazi1@gmail.com',
        password: 'iljaziEzan111'
      })
      expect(res.status).toBe(200)
      expect(res.data).toEqual(
        {
            email: "ezaniljazi1@gmail.com",
            message: "success",
            name: "Ezan",
            sport: "Football",
            token: res.data.token
        })
    });

    test('login with fake user', async () => {
      try {
        await axios.post(`${url}/login`, {
          email: 'test@user.com',
          password: 'user1234'
        })
            
      } catch (err) {
        expect(err.response.status).toBe(400)
        expect(err.message).toEqual(
          'Request failed with status code 400'
        )
      }
    })
  })