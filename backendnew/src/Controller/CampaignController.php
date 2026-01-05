<?php

namespace App\Controller;

use Doctrine\DBAL\Connection;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class CampaignController extends AbstractController
{
    #[Route('/api/campaigns', name: 'api_campaigns_list', methods: ['GET'])]
    public function list(Connection $db): JsonResponse
    {
        $rows = $db->fetchAllAssociative('SELECT id, titre, description, image, objectif_financier, montant_collecte, date_debut, date_fin, createur_id, organisation_id, statut, date_creation, date_modification FROM campaigns ORDER BY date_creation DESC');
        return $this->json($rows);
    }

    #[Route('/api/campaigns', name: 'api_campaigns_create', methods: ['POST'])]
    public function create(Request $request, Connection $db): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);
        if (!is_array($payload)) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }
        $titre  = trim((string)($payload['titre'] ?? $payload['title'] ?? ''));
        $desc   = isset($payload['description']) ? (string)$payload['description'] : null;
        $image  = isset($payload['image']) ? (string)$payload['image'] : null;
        $goal   = $payload['objectif_financier'] ?? $payload['goal'] ?? null;
        $debut  = $payload['date_debut'] ?? $payload['startDate'] ?? null;
        $fin    = $payload['date_fin'] ?? $payload['endDate'] ?? null;
        $createurId = $payload['createur_id'] ?? $payload['creatorId'] ?? null;
        $orgId  = $payload['organisation_id'] ?? $payload['organizationId'] ?? null;
        $statut = $payload['statut'] ?? $payload['status'] ?? 'ACTIVE';

        if ($titre === '' || $goal === null) {
            return $this->json(['error' => 'titre/title et objectif_financier/goal requis'], Response::HTTP_BAD_REQUEST);
        }

        $data = [
            'titre'               => $titre,
            'description'         => $desc,
            'image'               => $image,
            'objectif_financier'  => (float)$goal,
            'date_debut'          => $debut,
            'date_fin'            => $fin,
            'createur_id'         => $createurId,
            'organisation_id'     => $orgId,
            'statut'              => $statut,
        ];
        $db->insert('campaigns', $data);
        $id = (int)$db->lastInsertId();
        $row = $db->fetchAssociative('SELECT id, titre, description, image, objectif_financier, montant_collecte, date_debut, date_fin, createur_id, organisation_id, statut, date_creation, date_modification FROM campaigns WHERE id = :id', ['id' => $id]);
        return $this->json($row, Response::HTTP_CREATED);
    }

    #[Route('/api/campaigns/{id}', name: 'api_campaigns_detail', methods: ['GET'])]
    public function detail(int $id, Connection $db): JsonResponse
    {
        $row = $db->fetchAssociative('SELECT id, titre, description, image, objectif_financier, montant_collecte, date_debut, date_fin, createur_id, organisation_id, statut, date_creation, date_modification FROM campaigns WHERE id = :id', ['id' => $id]);
        if (!$row) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }
        return $this->json($row);
    }

    #[Route('/api/campaigns/{id}', name: 'api_campaigns_update', methods: ['PUT','PATCH'])]
    public function update(int $id, Request $request, Connection $db): JsonResponse
    {
        $exists = $db->fetchOne('SELECT 1 FROM campaigns WHERE id = :id', ['id' => $id]);
        if (!$exists) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }
        $payload = json_decode($request->getContent(), true);
        if (!is_array($payload)) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }
        $data = [];
        foreach ([
            'titre' => ['titre','title'],
            'description' => ['description'],
            'image' => ['image'],
            'objectif_financier' => ['objectif_financier','goal'],
            'date_debut' => ['date_debut','startDate'],
            'date_fin' => ['date_fin','endDate'],
            'createur_id' => ['createur_id','creatorId'],
            'organisation_id' => ['organisation_id','organizationId'],
            'statut' => ['statut','status'],
        ] as $column => $aliases) {
            foreach ($aliases as $k) {
                if (array_key_exists($k, $payload)) {
                    $data[$column] = $payload[$k];
                    break;
                }
            }
        }
        if (isset($data['objectif_financier'])) $data['objectif_financier'] = (float)$data['objectif_financier'];
        if ($data) {
            $db->update('campaigns', $data, ['id' => $id]);
        }
        $row = $db->fetchAssociative('SELECT id, titre, description, image, objectif_financier, montant_collecte, date_debut, date_fin, createur_id, organisation_id, statut, date_creation, date_modification FROM campaigns WHERE id = :id', ['id' => $id]);
        return $this->json($row);
    }

    #[Route('/api/campaigns/{id}/donations', name: 'api_campaigns_donations', methods: ['GET'])]
    public function donations(int $id, Connection $db): JsonResponse
    {
        $sql = 'SELECT d.id, d.montant, d.message, d.date_don, dn.nom AS donor_nom, dn.email AS donor_email
                FROM donations d
                LEFT JOIN donors dn ON dn.id = d.donateur_id
                WHERE d.campagne_id = :id
                ORDER BY d.date_don DESC';
        $rows = $db->fetchAllAssociative($sql, ['id' => $id]);
        return $this->json($rows);
    }

    #[Route('/api/campaigns/{id}', name: 'api_campaigns_delete', methods: ['DELETE'])]
    public function delete(int $id, Connection $db): JsonResponse
    {
        $exists = $db->fetchOne('SELECT 1 FROM campaigns WHERE id = :id', ['id' => $id]);
        if (!$exists) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }
        // Remove dependent donations first if FK constraints exist
        $db->executeStatement('DELETE FROM donations WHERE campagne_id = :id', ['id' => $id]);
        $db->delete('campaigns', ['id' => $id]);
        return $this->json(['status' => 'deleted']);
    }
}
