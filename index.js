fetch('http://localhost:43000/graph')
  .then(function(response) {
    return response.json()
  })
  .then(function(graphs) {
    console.log(graphs)

    const heatsArr = [
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

    // https://bl.ocks.org/pstuffa/d5934843ee3a7d2cc8406de64e6e4ea5
    const heatValuesSet = heatsArr.map(h => h.heat)
    const minHeat = d3.min(heatValuesSet)
    const maxHeat = d3.max(heatValuesSet)
    const colorScale = d3
      .scaleSequential(d3.interpolateOranges)
      .domain([minHeat, maxHeat])

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
    if (heatsArr.length !== 0) {
      // debugger
      for (let i = 0; i < data.nodes.length && heatsArr.length > 0; i++) {
        if (data.nodes[i].id !== heatsArr[0].number + '') {
          data.nodes[i] = {
            ...data.nodes[i],
            description: heatsArr[0].sql,
            style: { lineWidth: 2, fill: colorScale(heatsArr[0].heat) }
          }
          heatsArr.shift()
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
