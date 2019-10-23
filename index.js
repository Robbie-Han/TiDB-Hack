fetch('http://localhost:43000/graph')
  .then(function(response) {
    return response.json()
  })
  .then(function(graphs) {
    console.log(graphs)

    const heat = [
      {
        number: 0, // 对应节点的编号
        alter: 0, // 对应分支的编号(即之前传的alter数组的下标)
        heat: 30, // 热力值
        sql: 'xxxx' //示例sql
      },
      {
        number: 0,
        alter: 1,
        heat: 13,
        sql: 'yyy'
      },
      {
        number: 1,
        alter: 0,
        heat: 3,
        sql: 'zzz'
      },
      {
        number: 2,
        alter: 0,
        heat: 23,
        sql: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
      }
    ]

    let data = { nodes: [], edges: [] }

    /*let node = [{
    id: "0",
    label: "0",
    cluster: "a",
    description: 'This is node-3.',
    style: {
      lineWidth: 2,
      fill: 'red'
    }}]
    edges: [{
              source: "0",
              target: "1"
          }
    */
    /*node*/
    if (graphs.length !== 0) {
      let x = 100,
        y = window.innerHeight / 2
      for (let item of graphs) {
        let node = {}

        node.id = item.number + ''
        node.label = item.head
        node.shape = 'circle'
        node.x = x
        node.y = y
        data.nodes.push(node)

        x = x + 100
        y = 50

        if (item.alter && item.alter.length) {
          for (let i = 0; i < item.alter.length; i++) {
            let subNode = {}
            subNode.id = node.id + i
            subNode.label = item.alter[i].content
            subNode.x = x
            subNode.y = y
            data.nodes.push(subNode)
            y += 50
            data.edges.push({ source: node.id, target: subNode.id })

            let fanout = item.alter[i].fanout
            for (let item of fanout) {
              data.edges.push({ source: subNode.id, target: item + '' })
            }
          }
          y = window.innerHeight / 2
        }
      }
    }

    /*heat*/
    if (heat.length !== 0) {
      // debugger
      for (let i = 0; i < data.nodes.length && heat.length > 0; i++) {
        if (data.nodes[i].id !== heat[0].number + '') {
          data.nodes[i] = {
            ...data.nodes[i],
            description: heat[0].sql,
            style: { lineWidth: 2, fill: 'rgb(' + heat[0].heat + ', 180, 180)' }
          }
          heat.shift()
        }
      }
    }

    /*pic*/
    const graph = new G6.Graph({
      container: 'mountNode',
      width: window.innerWidth,
      height: window.innerHeight,

      defaultNode: {
        size: [20, 20],
        shape: 'rect'
      },
      defaultEdge: {
        size: 2,
        color: '#e2e2e2',
        style: {
          endArrow: {
            path: 'M 4,0 L -4,-4 L -4,4 Z',
            d: 4
          }
        }
      },
      modes: {
        default: [
          'drag-node',
          'drag-canvas',
          'zoom-canvas',
          {
            type: 'tooltip',
            formatText: function formatText(model) {
              const text = 'description: ' + model.description
              return text
            },

            shouldUpdate: function shouldUpdate(e) {
              return true
            }
          }
        ]
      }
    })
    graph.data(data)
    graph.render()
  })
